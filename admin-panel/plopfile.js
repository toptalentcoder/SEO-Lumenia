module.exports = function (plop) {
    plop.setGenerator('resource', {
        description: 'Generate CRUD resource',
        prompts: [
            { type: 'input', name: 'name', message: 'Resource name (e.g. user)' }
        ],
        actions: [
            {
                type: 'add',
                path: 'src/resources/{{lowerCase name}}/List.tsx',
                templateFile: 'plop-templates/List.hbs',
            },
            {
                type: 'add',
                path: 'src/resources/{{lowerCase name}}/Form.tsx',
                templateFile: 'plop-templates/Form.hbs',
            },
            {
                type: 'add',
                path: 'src/resources/{{lowerCase name}}/useApi.ts',
                templateFile: 'plop-templates/useApi.hbs',
            },
            {
                type: 'add',
                path: 'src/types/{{lowerCase name}}.ts',
                templateFile: 'plop-templates/type.hbs',
            }

        ],
    })
}
