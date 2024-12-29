import API from "./interceptor";

export interface IInitialValuesType {
  formType: "LOGIN" | "REGISTER";
  email: string;
  username: string;
  password: string;
}

export const AuthService = {
  handleAuthentication: async (payload: IInitialValuesType) => {
    try {
      switch (payload.formType) {
        case "LOGIN": {
          const response = await API.post("/login", {
            email: payload.email,
            password: payload.password,
          });
          return response.data;
        }
        case "REGISTER": {
          const response = await API.post("/register", {
            username: payload.username,
            email: payload.email,
            password: payload.password,
          });
          return response.data;
        }
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getCurrentUser() {
    const endpoint = "/current-user";
    try {
      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
