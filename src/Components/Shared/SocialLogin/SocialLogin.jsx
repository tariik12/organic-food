import { useContext } from "react";

import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { UserContext } from "../../../provider/UsersProvider/UsersProvider";
import { AuthContext } from "../../../provider/AuthProvider/AuthProvider";


const SocialLogin = () => {
  const { handleGoogleProvider } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const {users, addUsers} = useContext(UserContext);
console.log(users)
  const handleGoogleSignIn = () => {
    handleGoogleProvider()
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);
        if (loggedUser) {
          const saveUser = {
            name: loggedUser.displayName,
            email: loggedUser.email,
            photo: loggedUser.photoURL,
            role: "user",
          };
          const existingUser = users.find(user => user.email === saveUser.email)
         if(!existingUser){
          addUsers(saveUser);
          localStorage.setItem("memberData", JSON.stringify(saveUser));
        }else{
           localStorage.setItem("memberData", JSON.stringify(existingUser));

         }

          navigate(from, { replace: true });
          toast.success("Login success");
        }
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="mt-5">
      <div className="flex gap-3">
        <button
          onClick={handleGoogleSignIn}
          className="border border-primary text-xs font-thin w-[160px] rounded-3xl flex btn-sm Products-center"
        >
          <div className="mx-auto flex Products-center">
            <FcGoogle className="text-lg font-serif" />
            <p className="ms-1 text-white"> Login up with Google </p>
          </div>
        </button>
        {/* Assuming you have a similar function for Facebook login */}
        {/* <button
          onClick={handleFacebookSignIn}
          className="hover:bg-transparent border border-primary text-xs font-thin w-[160px] rounded-3xl flex btn-sm Products-center "
        >
          <div className="mx-auto flex Products-center">
            <BiLogoFacebookCircle className="text-lg text-[#1589FF]" />
            <p className="ms-1"> Sign up with Facebook </p>
          </div>
        </button> */}
      </div>
      <p className="text-center mt-3 text-2xl font-serif">-OR-</p>
    </div>
  );
};

export default SocialLogin;
