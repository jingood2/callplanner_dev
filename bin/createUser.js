use admin
db.createUser(
    {
        user: "callPlanner",
        pwd: "callPlaner@wpfh",
        roles: [ 
                    { role: "userAdminAnyDatabase", db: "admin" }
               ]
    }
);
