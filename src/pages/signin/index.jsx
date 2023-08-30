import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Signin = () => {
  const navigate = useNavigate();
  const responseMessage = (response) => {
    console.log(response);
    navigate("/streamer/room1");
  };
  const errorMessage = (error) => {
    console.log(error);
    Swal.fire(
      "Login Failed",
      "You are not authorized to access the app",
      "fail"
    );
  };

  return (
    <div className="grid place-content-center">
      <div>
        <h2>React Google Login</h2>
        <br />
        <br />
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
    </div>
  );
};

export default Signin;
