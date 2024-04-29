import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import StudentView from "../pages/student/index.vue";
import LoginView from "../pages/login/index.vue";
import AdminView from "../pages/admin/index.vue";

import axios from "axios";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "root", component: LoginView },
  { path: "/student", name: "student", component: StudentView },
  { path: "/admin", name: "admin", component: AdminView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
async function refeshToken(refresh: string) {
  const res = await axios.post("http://localhost:8888/login/refresh", null, {
    headers: {
      Authorization: `Bearer ${refresh}`,
    },
  });
  const token = res.data;
  cookies.remove("accesstoken");
  cookies.remove("refreshtoken");

  cookies.set("accesstoken", token.access_token);
  cookies.set("refreshtoken", token.refresh_token);
}

async function isAuthenticated() {
  // ! get token from cookies
  const accesstoken = cookies.get("accesstoken");
  const refreshtoken = cookies.get("refreshtoken");

  console.log("accesstoken: ", accesstoken);
  // ! check if cookies haven't accesstoken
  if (
    accesstoken === undefined ||
    accesstoken === null ||
    refeshToken === undefined ||
    refeshToken === null
  ) {
    // console.log("test");
    return false;
  }
  // ! parseJwt from cookies
  const jwtPayload = parseJwt(accesstoken);
  console.log(jwtPayload.exp, ` Time :  ${Date.now() / 1000}`);
  // ! check accesstoken is expired
  if (jwtPayload.exp < Date.now() / 1000) {
    // token expired
    console.log("expried");
    console.log(refreshtoken);
    await refeshToken(refreshtoken);
    return false;
  }

  return true;
}

function isRole(role: string) {
  const accesstoken = cookies.get("accesstoken");
  const access_token_extract = parseJwt(accesstoken);
  console.log(access_token_extract.role);
  if (access_token_extract.role === role) {
    return true;
  }
  return false;
}

router.beforeEach(async (to, from, next) => {
  console.log("isAuthen", await isAuthenticated());
  const isAuth = await isAuthenticated();
  // ! check if path isn't "/" and authenticated
  if (to.name !== "root" && !isAuth) {
    console.log("unauthenticated");
    // ! redirect to "/"
    next({ name: "root" });
  }
   else if(isAuth){
    console.log("authenticated");
    // console.log("isADMIN ", isRole("ADMIN"));
    if (to.name === "admin" && isRole("ADMIN") === false) {
      console.log("you aren't admin");

      cookies.remove("accesstoken");
      cookies.remove("refreshtoken");

      console.log("GET OUT!");

      next({ name: "root" });
    }

    

  }
    console.log("unauthenticated");
    next();
    
});

export default router;
