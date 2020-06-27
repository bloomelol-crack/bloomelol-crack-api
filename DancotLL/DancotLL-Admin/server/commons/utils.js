const formatIntent = (Intent, StepName, Indexes) => `${Intent}:${StepName}(${Indexes.join(', ')})`;

module.exports = { formatIntent };
