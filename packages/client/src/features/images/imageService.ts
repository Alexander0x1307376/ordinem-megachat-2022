import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../store/utils/reauthBaseQuery";

export const imagesApi = createApi({
  reducerPath: 'imagesApi',
  baseQuery: baseQueryWithReauth,
  // tagTypes: [''],

  endpoints: build => ({

    uploadImage: build.mutation<any, any>({
      query: body => ({
        url: 'image/upload',
        method: 'POST',
        body
      }),
      // invalidatesTags: ['']
    }),

  })

});

export const {
  useUploadImageMutation
} = imagesApi;