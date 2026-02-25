
import { rulesFromInternalType } from './src/utils/validators';

const typesToTest = [
    'String',
    'Currency',
    'Number',
    'Decimal',
    'Double',
    'Text',
    'Boolean',
    'Date',
    'List',
    'Percentage',
    'Phone'
];

console.log("Testing rulesFromInternalType with new types:");
typesToTest.forEach(type => {
    const rules = rulesFromInternalType(type);
    console.log(`Type: "${type}" -> Validation: ${rules.validation}, Transformation: ${rules.transformation}, Display: ${rules.displayName}`);
});
