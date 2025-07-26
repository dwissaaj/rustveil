// {
//   "$schema": "../gen/schemas/desktop-schema.json",
//   "identifier": "default",
//   "description": "enables the default permissions",
//   "windows": ["main"],
//   "permissions": [
//     "core:default",
//     "fs:default",

//     {
//       "identifier": "fs:allow-app-read-recursive",
//       "allow": [
//         {
//           "path": "$APPDATA/*"
//         }
//       ]
//     },
//     "opener:default",
//     "log:default",
//     "dialog:default",
//     "store:default",
//     "sql:default",
//     "upload:default",
//     "http:default",
//     "sql:allow-close",
//     "sql:allow-execute",
//     "sql:allow-load",
//     "sql:allow-select"
//   ]
// }
