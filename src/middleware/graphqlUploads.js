import { graphqlUploadExpress } from 'graphql-upload';

export default graphqlUploadExpress({ maxFileSize: 5000000 });
