import Button from "./components/common/Button";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Markdown Studio</h1>
        <div className="button-demo">
          <h2>Button Component Test</h2>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Button variant="primary" onClick={() => alert("Primary clicked!")}>
              Primary Button
            </Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="text">Text Button</Button>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Button size="small">Small Button</Button>
            <Button size="medium">Medium Button</Button>
            <Button size="large">Large Button</Button>
          </div>

          <Button fullWidth>Full Width Button</Button>
          <div style={{ marginTop: "1rem" }}>
            <Button disabled>Disabled Button</Button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
