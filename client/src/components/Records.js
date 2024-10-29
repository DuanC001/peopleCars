import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Card, Button, Typography, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  GET_PEOPLE,
  DELETE_PERSON,
  DELETE_CAR,
} from "./queries";
import { Link } from "react-router-dom";
import UpdatePerson from "./form/UpdatePerson";
import UpdateCar from "./form/UpdateCar";

const { Title, Text } = Typography;

const Records = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);
  const [deletePerson] = useMutation(DELETE_PERSON);
  const [deleteCar] = useMutation(DELETE_CAR);
  const [editMode, setEditMode] = useState(null);

  const handleDeletePerson = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this person and all their cars?",
      centered: true,
      onOk() {
        deletePerson({
          variables: { id },
          update: (cache) => {
            const existingData = cache.readQuery({ query: GET_PEOPLE });

            const newData = existingData.people
              .filter((person) => person.id !== id)
              .map((person) => ({
                ...person,
                cars: person.cars.filter((car) => car.personId !== id),
              }));
            console.log({ newData });
            cache.writeQuery({
              query: GET_PEOPLE,
              data: { people: newData },
            });
          },
        });
      },
    });
  };

  const handleDeleteCar = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this car?",
      centered: true,
      onOk() {
        deleteCar({
          variables: { id },
          update: (cache) => {
            const existingData = cache.readQuery({ query: GET_PEOPLE });
            const updatedPeople = existingData.people.map((person) => ({
              ...person,
              cars: person.cars.filter((car) => car.id !== id),
            }));

            cache.writeQuery({
              query: GET_PEOPLE,
              data: { people: updatedPeople },
            });
          },
        });
      },
    });
  };

  const toggleEditMode = (type, data) => {
    setEditMode(editMode ? null : { type, data });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: 20,
          padding: "15px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Records
      </h1>
      {data.people.map((person) => (
        <Card
          key={person.id}
          title={
            <Title level={4}>{`${person.firstName} ${person.lastName}`}</Title>
          }
          extra={
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => toggleEditMode("person", person)}
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeletePerson(person.id)}
              />
            </Space>
          }
          style={{ width: "80%", maxWidth: "800px", margin: "16px auto" }}
        >
          {editMode?.type === "person" && editMode.data.id === person.id && (
            <UpdatePerson
              {...editMode.data}
              onButtonClick={() => toggleEditMode()}
            />
          )}
          {person.cars && person.cars.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {person.cars.map((car) => (
                <Card
                  key={car.id}
                  type="inner"
                  title={`${car.year} ${car.make} ${car.model} -> $${car.price}`}
                  style={{ marginBottom: "8px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {editMode?.type === "car" && editMode.data.id === car.id ? (
                      <UpdateCar
                        {...editMode.data}
                        onButtonClick={() => toggleEditMode()}
                      />
                    ) : (
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => toggleEditMode("car", car)}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteCar(car.id)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Text>No cars owned</Text>
          )}
          <Link
            to={`/people/${person.id}`}
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
            }}
          >
            LEARN MORE
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Records;
