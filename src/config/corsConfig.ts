
import { WHITE_LIST_URLS } from "@src/constants";

export const corsOptions = {
    origin: function (origin:any, callback:any) {
      var originIsWhitelisted = WHITE_LIST_URLS.indexOf(origin) !== -1
      callback(null, originIsWhitelisted)
          },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH', 'HEAD'],
  }

  