import "./App.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Title from "./components/Title";
import AddPerson from "./components/AddPerson";
import Records from "./components/Records";
import AddCar from "./components/AddCar";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const HomePage = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Title />
        <AddPerson />
        <AddCar />
        <Records />
      </div>
    </ApolloProvider>
  );
};

export default HomePage;
