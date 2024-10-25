import "./App.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Title from "./components/Title";
import AddPerson from "./components/AddPerson";
import Records from "./components/Records";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Title />
        <AddPerson/>
        <Records/>
      </div>
    </ApolloProvider>
  );
};

export default App;
