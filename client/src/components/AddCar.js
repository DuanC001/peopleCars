import { useQuery, useMutation } from "@apollo/client";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { ADD_CAR, GET_PEOPLE } from "./queries";
import { v4 as uuidv4 } from "uuid";

const AddCar = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE);
  const [addCar] = useMutation(ADD_CAR);

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    const { year, make, model, price, personId } = values;

    addCar({
      variables: {
        id: uuidv4(),
        year,
        make,
        model,
        price,
        personId,
      },
      update: (cache, { data: { addCar } }) => {
        const data = cache.readQuery({ query: GET_PEOPLE });

        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            ...data,
            people: data.people.map((person) =>
              person.id === personId
                ? { ...person, cars: [...person.cars, addCar] }
                : person
            ),
          },
        });
      },
    });

    form.resetFields();
  };

  // Check if there are people in the data
  const hasPeople = peopleData?.people?.length > 0;

  if (!hasPeople) return null; // Hide the form if there are no people

  return (
    <div>
      <h1
        style={{
          fontSize: 20,
          padding: "15px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Add Car
      </h1>
      <Form
        name="add-car-form"
        layout="inline"
        size="large"
        style={{ marginBottom: "40px" }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="year"
          rules={[{ required: true, message: "Enter the year" }]}
        >
          <InputNumber
            placeholder="Year"
            min={1886}
            max={new Date().getFullYear()}
          />
        </Form.Item>
        <Form.Item
          name="make"
          rules={[{ required: true, message: "Enter the make" }]}
        >
          <Input placeholder="Make" />
        </Form.Item>
        <Form.Item
          name="model"
          rules={[{ required: true, message: "Enter the model" }]}
        >
          <Input placeholder="Model" />
        </Form.Item>
        <Form.Item
          name="price"
          rules={[{ required: true, message: "Enter the price" }]}
        >
          <InputNumber placeholder="Price" min={0} step={0.01} />
        </Form.Item>
        <Form.Item
          name="personId"
          rules={[{ required: true, message: "Select a person" }]}
        >
          <Select
            placeholder="Select Person"
            loading={peopleLoading}
            options={
              peopleData?.people.map((person) => ({
                label: `${person.firstName} ${person.lastName}`,
                value: person.id,
              })) || []
            }
          />
        </Form.Item>
        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Add Car
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCar;
