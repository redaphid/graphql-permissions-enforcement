import { filterSchema } from '@graphql-tools/utils';
import { GraphQLSchema, isInputObjectType, isObjectType, printSchema } from 'graphql';

const removeEmptyRootTypes = (schema) => {
  const schemaConfig = schema.toConfig();
  const newTypes = schemaConfig.types.filter(type => {
    if (isObjectType(type) || isInputObjectType(type)) {
      return Object.keys(type.getFields()).length > 0;
    }
    return true;
  });

  return new GraphQLSchema({
    ...schemaConfig,
    types: newTypes,
    query: Object.keys(schemaConfig.query.getFields()).length > 0 ? schemaConfig.query : null,
    mutation: Object.keys(schemaConfig.mutation.getFields()).length > 0 ? schemaConfig.mutation : null,
  });
};

const removeNonPublicTypes = (schema) => {
  return filterSchema({
    schema,
    fieldFilter: (typeName, fieldName, fieldConfig) => {
      return Boolean(fieldConfig.astNode?.directives?.some(d => d.name.value === 'public'));
    },
    rootFieldFilter: (operationType, fieldName) => {
      const rootType = schema.getType(operationType);
      if (isObjectType(rootType)) {
        return Object.keys(rootType.getFields()).length > 0;
      }
      return false;
    },
    typeFilter: (typeName, type) => {
      if (isObjectType(type) || isInputObjectType(type)) {
        // Include the type only if it has one or more fields
        return Object.keys(type.getFields()).length > 0;
      }
      return true;  // keep other types
    },
  });
}

export const PublicDirectiveTransformer = (schema: GraphQLSchema) => {
  let filteredSchema = schema
  let lastSchemaString = ''
  let times = 0
  do {
    if(times > 10) throw new Error('PublicDirectiveTransformer failed to converge')
    lastSchemaString = printSchema(filteredSchema);
    filteredSchema = removeEmptyRootTypes(removeNonPublicTypes(filteredSchema));
    times++
  } while (printSchema(filteredSchema) !== lastSchemaString);
  return filteredSchema;
};
