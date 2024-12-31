import swaggerAutogen from "npm:swagger-autogen@2.23.7";

const outputFile = './swagger.json';
const endpointsFiles = ['./main.ts'];

swaggerAutogen(outputFile, endpointsFiles);