
import { rulesFromInternalType } from './src/utils/validators';

const typesToTest = [
    'String',
    'Currency',
    'Boolean',
    'Date',
    'Numeric',
    'Int',
    'List',
    'Percentage',
    'Phone',
    'UnknownType'
];

console.log("Testing rulesFromInternalType:");
typesToTest.forEach(type => {
    const rules = rulesFromInternalType(type);
    console.log(`Type: "${type}" -> Validation: ${rules.validation}, Transformation: ${rules.transformation}, Display: ${rules.displayName}`);
});
