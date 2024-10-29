import { useQuery, useMutation } from "@apollo/client";
import { Button, Form, Input, InputNumber, Select, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { UPDATE_CAR, GET_PEOPLE } from "../queries";

const UpdateCar = (props) => {
  const { id, year, make, model, price, personId, onButtonClick } = props;

  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE);
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }],
    awaitRefetchQueries: true, 
    onCompleted: () => onButtonClick(), 
  });
  useEffect(() => {
    forceUpdate();
  }, []);

  const onFinish = (values) => {
    updateCar({
      variables: { id: id, ...values },
    }).then(() => onButtonClick());
  };

  return (
    <Form
      name="update-Car-form"
      layout="inline"
      form={form}
      onFinish={onFinish}
      initialValues={{
        year,
        make,
        model,
        price,
        personId,
      }}
    >
      <Row gutter={[16, 16]}>
        <Col>
          <Form.Item
            name="year"
            label="Year"
            rules={[
              {
                required: true,
                message: "Please input the year!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item
            name="make"
            label="Make"
            rules={[
              {
                required: true,
                message: "Please input the make!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item
            name="model"
            label="Model"
            rules={[
              {
                required: true,
                message: "Please input the model!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "Please input the price!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item
            name="personId"
            label="Person"
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
        </Col>

        <Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={onButtonClick} style={{ marginLeft: "240px" }}>
              Cancel
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UpdateCar;
