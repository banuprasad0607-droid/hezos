import { r as reactExports } from "../_libs/react.mjs";
import { d as useRouter } from "../_libs/tanstack__react-router.mjs";
import { A as isRedirect } from "../_libs/tanstack__router-core.mjs";
import {
  a as createServerFn,
  T as TSS_SERVER_FUNCTION,
  b as getServerFnById,
} from "./server-DOPhEqh1.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CDUZ4KwQ.mjs";
import {
  o as objectType,
  s as stringType,
  n as numberType,
  e as enumType,
  l as literalType,
} from "../_libs/zod.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(
    async (...args) => {
      try {
        const res = await serverFn(...args);
        if (isRedirect(res)) throw res;
        return res;
      } catch (err) {
        if (isRedirect(err)) {
          err.options._fromLocation = router.stores.location.get();
          return router.navigate(router.resolveRedirect(err).options);
        }
        throw err;
      }
    },
    [router, serverFn],
  );
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true,
  });
};
const CreateSchoolInput = objectType({
  school: objectType({
    name: stringType().min(2).max(120),
    code: stringType().min(2).max(40),
    address: stringType().max(300).optional().default(""),
    email: stringType().email().max(120).or(literalType("")).optional().nullable(),
    phone: stringType().max(40).optional().nullable(),
    logo_url: stringType().url().max(500).or(literalType("")).optional().nullable(),
    plan: enumType(["starter", "professional", "enterprise"]).default("starter"),
    billing_cycle: enumType(["monthly", "quarterly", "yearly"]).default("monthly"),
    student_limit: numberType().int().min(10).max(1e5).default(500),
    teacher_limit: numberType().int().min(1).max(1e4).default(50),
    monthly_amount: numberType().min(0).max(1e6).default(0),
  }),
  admin: objectType({
    full_name: stringType().min(2).max(120),
    email: stringType().email().max(120),
    password: stringType().min(8).max(72),
  }),
});
const provisionSchool = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => CreateSchoolInput.parse(data))
  .handler(createSsrRpc("f5a10fa45077857e4d1ccffd01555f31e38f2fc7acf0424e1a6e7a1422ff961a"));
const ProvisionTeacherInput = objectType({
  email: stringType().email().max(120),
  full_name: stringType().min(2).max(120),
  password: stringType().min(8).max(72),
});
const provisionTeacher = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ProvisionTeacherInput.parse(data))
  .handler(createSsrRpc("6193ca6393ff03622607c8e55de2002fd953e53dcbd843c85041be86c59fb8d2"));
const SchoolIdInput = objectType({
  schoolId: stringType().uuid(),
});
const getSchoolCredentials = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => SchoolIdInput.parse(data))
  .handler(createSsrRpc("133844214a4719bda90889cd9afc62d29e0c7841cbe15401eb91c1345a8a4771"));
const resetAdminPassword = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => SchoolIdInput.parse(data))
  .handler(createSsrRpc("c7daddccdc4a017418bf0449431ca08cd5c578b6a1bf52bd6661311bcd53d9e8"));
const ProvisionStudentInput = objectType({
  student: objectType({
    full_name: stringType().min(1).max(120),
    admission_number: stringType().max(40).nullable().optional(),
    roll_number: stringType().max(40).nullable().optional(),
    class_id: stringType().uuid(),
    date_of_birth: stringType().max(20).nullable().optional(),
    gender: stringType().max(20).nullable().optional(),
    address: stringType().max(400).nullable().optional(),
    photo_url: stringType().max(1e3).nullable().optional(),
  }),
  parent: objectType({
    full_name: stringType().max(120).nullable().optional(),
    email: stringType().email().max(120).nullable().optional(),
    phone: stringType().max(40).nullable().optional(),
    password: stringType().min(8).max(72).nullable().optional(),
  }),
});
const provisionStudent = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ProvisionStudentInput.parse(data))
  .handler(createSsrRpc("74b7c266f17fc6d5b1c13c80e08d7e19423388a35e64756457927e70d6973987"));
const BootstrapSchoolInput = objectType({
  name: stringType().min(2).max(120),
});
createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => BootstrapSchoolInput.parse(data))
  .handler(createSsrRpc("0b555f14295dc8bb51ce806a00ff7f2f77bcfbe15bed2747495355e8757e2db7"));
const LoginInput = objectType({
  email: stringType().email().max(120),
  password: stringType().min(6).max(72),
});
const loginAttemptServer = createServerFn({
  method: "POST",
})
  .inputValidator((data) => LoginInput.parse(data))
  .handler(createSsrRpc("167edb1c60030c9184e6d11128b4ea90f01d5a02d17005feca7fc87c6859134d"));
const ResetEmailInput = objectType({
  email: stringType().email().max(120),
  redirectTo: stringType().url().max(500),
});
const resetPasswordEmailServer = createServerFn({
  method: "POST",
})
  .inputValidator((data) => ResetEmailInput.parse(data))
  .handler(createSsrRpc("58ddf5d25e1dfb1dd783a74fb6c21b95be7cb5f10822e4b6efda608e38293daa"));
export {
  provisionStudent as a,
  provisionTeacher as b,
  resetPasswordEmailServer as c,
  getSchoolCredentials as g,
  loginAttemptServer as l,
  provisionSchool as p,
  resetAdminPassword as r,
  useServerFn as u,
};
