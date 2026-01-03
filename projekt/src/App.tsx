import "./App.css";
import { ProductCard } from "./components/products/ProductCard";

function App() {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => console.log(json));
  return (
    <div>
      <h1>Witamy w naszym sklepie!</h1>
      <ProductCard
        product={{
          id: 1,
          title: "Przykładowy produkt",
          price: 29.99,
          description: "To jest przykładowy opis produktu.",
          category: "elektronika",
          image: "https://via.placeholder.com/150",
          stock: 10,
          features: ["Cech 1", "Cech 2", "Cech 3"],
        }}
      />
    </div>
  );
}

export default App;
