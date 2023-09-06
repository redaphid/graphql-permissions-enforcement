import { ArgumentFilter, FieldFilter, ObjectFieldFilter, TypeFilter, filterSchema, getDirectives } from '@graphql-tools/utils';
import { DocumentNode, GraphQLSchema, isEnumType, isInputObjectType, isInterfaceType, isListType, isObjectType, isScalarType, isUnionType, printSchema } from 'graphql';

const isEmptyRootType = (rootType, schema) => {
  if (!rootType) return true;
  const directives = getDirectives(schema, rootType);
  if (directives && directives.some(d => d.name === 'public')) {
    return false;
  }
  return true
}
const removeEmptyRootTypes = (schema: GraphQLSchema) => {
  const schemaConfig = schema.toConfig();
  let query = schemaConfig.query;
  if (isEmptyRootType(query, schema)) {
    schemaConfig.query = null;
  }

  let mutation = schemaConfig.mutation;
  if (isEmptyRootType(mutation, schema)) {
    schemaConfig.mutation = null;
  }

  return new GraphQLSchema({
    ...schemaConfig,
  });
}
const removeNonPublicTypes = (schema: GraphQLSchema) => {

  const hasPublicDirective: FieldFilter = (typeName, fieldName, fieldConfig) => {
    if (typeName.startsWith('_') || typeName.includes('__')) return true;
    return Boolean(fieldConfig.astNode?.directives?.some(d => d.name.value === 'public'));
  }

  const typeFilterNonPublic: TypeFilter = (typeName, type) => {
    if (isObjectType(type) || isInputObjectType(type) || isInterfaceType(type)) {
      if (Object.keys(type.getFields()).length === 0) {
        return false;
      }
      if (!getDirectives(schema, type)?.some(d => d.name === 'public')) return false;
      return true;
    }

    if (isListType(type)) {
      return typeFilterNonPublic(typeName, type.ofType);
    }
    if (isUnionType(type)) {
      return type.getTypes().every(t => typeFilterNonPublic(typeName, t));
    }
    if (isEnumType(type)) {
      return true
    }
    if (isScalarType(type)) {
      return true
    }
    return true
  }

  const filterNonPublicFields: FieldFilter = (typeName, fieldName, fieldConfig) => {
    // if (fieldName.startsWith('_')) return true;
    if (!hasPublicDirective(typeName, fieldName, fieldConfig)) return false;
    if (!typeFilterNonPublic(typeName, fieldConfig.type)) return false;
    if (isInputObjectType(fieldConfig.type)) {
      if (Object.keys(fieldConfig.type.getFields()).length === 0) return false;
    }
    // throw new Error(`I would remove this field: ${typeName}, ${fieldName}`)
    return true
  }

  const filterNonPublicArguments: ArgumentFilter = (typeName, fieldName, argNam, argConfig?) => {
    if (!argConfig) return false;
    if (!hasPublicDirective(typeName || '', fieldName || '', argConfig)) return false;
    if (!typeFilterNonPublic(typeName || '', argConfig.type)) return false;
    return true
  }

  return filterSchema({
    schema,
    rootFieldFilter: filterNonPublicFields,
    typeFilter: typeFilterNonPublic,
    fieldFilter: filterNonPublicFields,
    objectFieldFilter: filterNonPublicFields,
    interfaceFieldFilter: filterNonPublicFields,
    inputObjectFieldFilter: filterNonPublicFields,
    // argumentFilter: filterNonPublicArguments,
  });
}

export const PublicDirectiveTransformer = (schema: DocumentNode) => {
  return true
};

