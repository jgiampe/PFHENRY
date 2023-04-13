import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { useAuth } from "../../context/authContext";

function Register() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    nickName: "",
    fullName: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    nickName: "",
    fullName: ""
  });
  const navigate = useNavigate();

  const { signup, loginWithGoogle } = useAuth();

  function handleInputChange(e) {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signup(userData.email, userData.password, userData.nickName, userData.fullName);
      navigate("/home");
    } catch (error) {
      if (error.code === "auth/weak-password")
        setErrors({
          ...errors,
          password: "Password too short, at least 6 characters",
        });
      if (error.code === "auth/invalid-email")
        setErrors({ ...errors, email: "You must introduce an email" });
      if (error.code === "auth/email-already-in-use")
        setErrors({ ...errors, email: "Email already in use" });
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate("/home");
    } catch (error) {
      alert("Error al iniciar sesion: ", error);
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "2rem",
      }}
      onSubmit={handleSubmit}
      >
      <TextField
        type="text"
        label="Nombre de usuario"
        name="nickName"
        value={userData.nickName}
        onChange={handleInputChange}
        style={{ margin: "1rem" }}
      />
      {errors.nickName && <p>{errors.nickName}</p>}

      <TextField
        type="text"
        label="Nombre completo"
        name="fullName"
        value={userData.fullName}
        onChange={handleInputChange}
        style={{ margin: "1rem" }}
      />
      {errors.fullName && <p>{errors.fullName}</p>}
      <TextField
        type="email"
        label="Correo electrónico"
        name="email"
        value={userData.email}
        onChange={handleInputChange}
        style={{ margin: "1rem" }}
      />
      {errors.email && <p>{errors.email}</p>}
      <TextField
        type="password"
        label="Contraseña"
        name="password"
        value={userData.password}
        onChange={handleInputChange}
        style={{ margin: "1rem" }}
      />
      {errors.password && <p>{errors.password}</p>}
      <Button
        type="submit"
        variant="contained"
        color="info"
        style={{ margin: "2rem" }}
      >
        Registrarse
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleGoogleSignIn}
        style={{ margin: "2rem" }}
      >
        Registrarse con Google
      </Button>
      <Link to="/login">¿Ya tienes una cuenta? Inicia sesión aquí.</Link>
    </form>
  );
}

export default Register;
