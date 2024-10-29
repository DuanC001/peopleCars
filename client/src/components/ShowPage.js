import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { GET_PERSON_WITH_CARS } from "./queries";

const ShowPage = () => {
  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const person = data?.personWithCars;

  return (
    <div>
      <h1>
        {person?.firstName} {person?.lastName}
      </h1>
      <h2>Cars:</h2>
      <ul>
        {person?.cars.map((car) => (
          <li key={car.id}>
            {car.year} {car.make} {car.model} - ${car.price}
          </li>
        ))}
      </ul>
      <Link to="/">
        <button>GO BACK HOME</button>
      </Link>
    </div>
  );
};

export default ShowPage;
