# TS JSON Mapper

### About

This module allows to transform JSON objects, received from back-end, to corresponding TypeScript models.

### Installation

```
npm install --save ts-json-mapper
```

### Usage

1. Define your models, being extended from 'BaseModel'

    ```
    import { BaseModel } from 'ts-json-mapper';

    class Apple extends BaseModel { }
    class Person extends BaseModel { }
    ```

2. Decorate model properties with 'ModelProperty'

    ```
    import { BaseModel, ModelProperty } from 'ts-json-mapper';

    class Apple extends BaseModel {
        @ModelProperty()
        public color: string;
    }

    class Person extends BaseModel {
        @ModelProperty()
        public born: Date;

        @ModelProperty('given_name')
        public givenName: string;

        @ModelProperty('favourite_apple', Apple)
        public favouriteApple: Apple;

        @ModelProperty('apples_in_pockets', Apple)
        public applesInPockets: Apple[];
    }
    ```

    Note:

    - `ModelProperty` may be used without parameters when field names in JSON and TS model coincide and data is of primary type (`boolean`, `number` or `string`);
    - `ModelProperty` may be used with a single string parameter which specifies field name in JSON (data from field with that name will be mapped to decorated property);
    - `ModelProperty` may be used with two parameters: first being name of field in JSON, and second - class, which JSON data will be cast to; for arrays, **do not** use `Class[]`, use just `Class` instead.

3. Pass JSON retrieved from back-end to your model's constructor

    ```
    const data = {
        "born": "1994-02-08T09:30:19.259Z",
        "given_name": "Applejack",
        "favourite_apple": {
            "color": "red"
        },
        "apples_in_pockets": [
            { "color": "green" }
        ]
    };

    let person: Person = new Person(data);
    ```

    Note:

    - make sure all of your nested models are extended from `BaseModel` or have constructors available - those constructors will be called for nested objects;during deserialization;
    - if JSON doesn't contain proper field, corresponding model property will be `undefined`;
    - strings that are correct date strings (according to ISO 8601) are revived into `Date` objects.

4. In case you want to get initial JSON back, use 'toJSON' method (inherited from 'BaseModel')

    ```
    person.toJSON();
    ```

    Note:

    - make sure all of your nested models are extended from `BaseModel` or implement `toJSON` method - that method is used for nested objects during serialization;
    - model properties that are `undefined` will not be added to JSON;
    - dates are turned back into ISO strings.