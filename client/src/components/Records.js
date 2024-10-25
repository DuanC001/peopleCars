import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Card, Button, Typography, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { GET_PEOPLE, DELETE_PERSON } from "./queries"; 

const { Title, Text } = Typography;

const Records = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);
  const [deletePerson] = useMutation(DELETE_PERSON);

  const handleDelete = (id) => {
    deletePerson({
      variables: { id },
      update: (cache) => {
        const existingData = cache.readQuery({ query: GET_PEOPLE });
        const newData = existingData.people.filter(
          (person) => person.id !== id
        );

        cache.writeQuery({
          query: GET_PEOPLE,
          data: { people: newData },
        });
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 style={{ 
        fontSize: 20, 
        padding: "15px", 
        marginBottom: "20px",
        textAlign: "center"  }}>
        Records
      </h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {data.people.map((person) => (
          <Card
            key={person.id}
            title={
              <Title
                level={4}
              >{`${person.firstName} ${person.lastName}`}</Title>
            }
            extra={
              <Space>
                <Button icon={<EditOutlined />} />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(person.id)}
                />
              </Space>
            }
            style={{ width: 300 }}
          >
            {person.cars && person.cars.length > 0 ? (
              <div>
                {person.cars.map((car) => (
                  <Text key={car.id}>
                    {`${car.year} ${car.make} ${car.model} -> $${car.price}`}
                    <br />
                  </Text>
                ))}
              </div>
            ) : (
              <Text>No cars owned</Text>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Records;
