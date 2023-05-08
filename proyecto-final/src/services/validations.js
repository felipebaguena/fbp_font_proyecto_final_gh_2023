export const validate = (name, data, required) => {
  switch (name) {
    case "name":
    case "nombre":
      if (data === "" && required === true) {
        return { message: "Por favor, rellena este campo", validated: false };
      } else if (!/^[a-zA-Z\s]{1,18}$/gi.test(data)) {
        return {
          message:
            "Por favor, introduce sólo letras y espacios (máximo 18 caracteres)",
          validated: false,
        };
      }
      return { message: "", validated: true };

    case "email":
      if (data === "" && required === true) {
        return { message: "Por favor, rellena este campo", validated: false };
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data)
      ) {
        return {
          message: "Formato de correo electrónico inválido",
          validated: false,
        };
      }

      return { message: "", validated: true };

      case "password":
        if (data === "" && required === true) {
          return { message: "Por favor, rellena este campo", validated: false };
        } else if (
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+|~\-=?\[\]{};:<>,./]).{8,64}$/g.test(
            data
          )
        ) {
          return {
            message:
              "La contraseña debe contener mayúsuclas, minúsculas, números y carácteres especiales",
            validated: false,
          };
        }
        return { message: "", validated: true };
  }
};
