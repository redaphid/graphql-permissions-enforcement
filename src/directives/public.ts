import { mapSchema, MapperKind, GenericFieldMapper } from '@graphql-tools/utils';
import { GraphQLSchema, GraphQLFieldConfig } from 'graphql';

export const PublicDirective = (schema: GraphQLSchema) => {
  return mapSchema(schema, {
    [MapperKind.FIELD]: ((fieldConfig) => {
      if(fieldConfig === null) throw new Error('fieldConfig is null');
      return fieldConfig
    })
  });
};

export default PublicDirective;
