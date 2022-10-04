import { checkDataType, cloneAndPluck, deepClone } from "./reusable";


cloneAndPluck

export function updateFlexibleModuleSpecs(moduleSpecs, updateFormData = {}) {


    const permanentFields = [
        // Always present
        '_id',
        'id',
        'name',
        'linkedMWOs',
        'linkedPOs',
        'qty',
        'unitPrice',
        'remarks',
        // Present after specs-update
        'application',
        'type',
        // ? Flexible - we want to delete these and add then add the flexible fields from the form
        // 's1',
    ];

    moduleSpecs = {
        ...cloneAndPluck(
            moduleSpecs,
            permanentFields
        ),
        ...updateFormData
    }


    return moduleSpecs;

}


// export a function named filterPOmoduleData & filterMWOmoduleData which returns the received data
/* 
  const formFieldsPOitem = {
    ? module specific
    id
    name
    application
    type
    
    ? source specific
    qty
    unitPrice
    remarks
  }
*/
// ? source-specific and independent module data
export const filterPOmoduleData = (data) => {
    // const { id, name, application, type, ...sourceData } = data;
    const { qty, unitPrice, remarks, ...moduleData } = data;

    return [
        moduleData,
        { qty, unitPrice, remarks },
    ];
}

/*
  const formFieldsMWO = {
    ? module specific
    TODO: Rename 'itemId' and 'itemName' to 'id' and 'name' respectively
    itemId
    itemName
    application
    type
    
    ? source specific
    mwoId
    qty
    status
    title
    remarks
  }

  ? const { id, name, type, application ...sourceDataPOitem } = formFieldsPOitem;
  ? const { itemId: id, itemName: name, type, application ...sourceDataMWO } = formFieldsMWO;

*/
export const filterMWOmoduleData = (data) => {
    // const { itemId: id, itemName: name, application, type, ...sourceData } = data;
    const { qty, remarks, ...moduleData } = data;

    return [
        moduleData,
        { qty, remarks }
    ];
}


// ? source-specific and independent module data
export const separateModuleAndSourceData = (data, sourceType = null) => {
    let sourceData = {};
    const { qty, unitPrice, remarks, ...moduleData } = data;

    if (sourceType === 'PO') {
        sourceData = { qty, unitPrice, remarks };
    } else if (sourceType === 'MWO') {
        sourceData = { qty, remarks };
    } else {
        return [moduleData, null];
    }

    return [
        moduleData,
        sourceData
    ];
}

export const sourceSpecificKeys = (sourceType = 'po') => {
    if (sourceType === 'po') return ['unitPrice', 'qty', 'remarks']
    if (sourceType === 'mwo') return [/* 'unitPrice',  */'qty', 'remarks']
}

export const moduleSpecificKeys = (returnLinkedFields = false) => {
    const moduleKeys = [
        "id",
        "name",
        "application",
        "type",
    ]
    if (!!returnLinkedFields) moduleKeys.concat(['linkedMWOs', "linkedPOs"])
    return moduleKeys
}



// takes in a list of POitems and returns a list of POitems with the linked modules populated
export function mapModulesToPO(linkedModules, moduleList) {
    return linkedModules.map((linkedModule) => {
        const { item: moduleRef, ...rest } = linkedModule;

        // match module._id with linkedModule.item
        const matchingModule = deepClone(
            moduleList.find(module => {
                return module._id === moduleRef
            })
        ) || {}

        // ? " || {} " was added to solve the problem of delay in state update. In the 1/2 of the state update, the empty module is returned to avoid the error and upon the 2/2 state update the logic runs again and fetches the matchingModule
        console.assert(matchingModule, 'MatchingModule is empty. Must Not Happen', matchingModule);

        delete matchingModule.linkedPOs;
        delete matchingModule.linkedMWOs;
        delete matchingModule.__v;

        return {
            ...matchingModule,
            ...rest,
        }

    })

}


/**
 * Input :
 * sourceObject :{
 *   fieldX : {
 *      initialValue: 'valX',
 *      validation: {...validationX ...},
 *   },
 *   fieldX : {
 *      initialValue: 'valY',
 *      validation: {...validationY ...},
 *   },
 * }
 * desiredKey: 'validation'
 * 
 * Output:
 * {
 *    fieldX: {...validationX ...},
 *    fieldY: {...validationY ...},
 * }
 * 
 * @interface Field
 * @property {string} [initialValue]
 * @property {Object} [validation]
 * @property {Object} [config]
 * 
 * @interface SourceObject
 * @property {Field} [fieldA]
 * @property {Field} [fieldB]
 * 
 * SourceObject's keys are re-mapped to nested 
 * @param  {StringObject} sourceObject
 * @param  {} desiredDataKey
 */
export function getOf(sourceObject, desiredDataKey) {
    // desiredDataKey === 'key2'
    // Input
    /* { 
        id: {key1:'',key2:'hello'} , 
        name: {key1:'',key2:'Jane Doe'} 
    } */
    // Output
    /* { 
        id: 'hello' , 
        name: 'Jane Doe' 
    } */

    const sourceEntries = Object.entries(sourceObject);
    /* 
    [ 
        ['id', {key1:'',key2:'hello'} ], 
        ['name', {key1:'',key2:'Jane Doe'} ] 
    ]
    */
    const reducedObject = sourceEntries.reduce(
        (prev, cur) => {
            const [sourceKey, sourceValue] = cur;
            prev[sourceKey] = sourceValue[desiredDataKey];
            return prev;
        }, {}
    )
    return reducedObject;
}


export function getObjectWithValuesAt(index, source, nestedKeysWrapper = false) {
    // Input: //? index:1, source: {x:['x1','x2'],y:['y1','y2']}
    // Output //? {x: 'x2', y: 'y2'}

    const responseObj = {};
    for (const key in source) {

        const [firstKey, ...nestedKeys] = key.split('.');

        if (!!nestedKeys.length) { // if nested keys exist
            const [secondKey, ...deepNestedKeys] = nestedKeys;
            if (!!deepNestedKeys.length) throw new Error('Multi-Nested keys are not supported yet');

            // if the first key is not defined already set it to {}
            responseObj[firstKey] = responseObj[firstKey] ?? {};
            responseObj[firstKey][secondKey] = source[key][index];


        } else { // if nested keys do not exist
            responseObj[firstKey] = source[key][index]
        }
    }

    // Wrap the nested keys in a nestedKeysWrapper object
    if (nestedKeysWrapper) {
        // check if any nested keys exist
        const wrappedResponseObj = Object.entries(responseObj).reduce(
            (acc, [key, value]) => {
                // check if the value is an object
                checkDataType(value) === 'object'
                    ? acc[key] = nestedKeysWrapper(value)
                    : acc[key] = value;
                return acc;
            }, []
        )
        return Object.fromEntries(wrappedResponseObj);
    }
    return responseObj;

}



/**
 * 
 * // Input
 * Component: 'CustomComponent'
 * propsConfigContainer: {
 *     id: {
 *         x:1,
 *         y:2
 *     },
 *     name: {
 *         a:{
 *             a1:3,
 *             a2:4
 *         },
 *         b:{
 *             b1:3,
 *             b2:4
 *         }
 *     },
 * }
 * // Output:(JSX)
 * [
 *     <CustomComponent key='id' x='1' y='2' /> 
 *     <CustomComponent key='name.a' a1='3' a2='4' /> 
 *     <CustomComponent key='name.b' b1='3' b2='4' /> 
 * ] 
 * @param  {} Component
 * @param  {} propsConfigContainer
 * @param  {} nestedKeys=false - in case a nested key is passed, ...
 */
export function getComponentArrayWithProps(Component, propsConfigContainer, nestedKeys = false) {
    // Input (Nested)


    // Loose the keys of the object and get an array of values
    const propsConfigEntries = Object.entries(propsConfigContainer)

    // For each value get the JSX of "FormikControl"

    const fieldComponents = propsConfigEntries.reduce(
        (acc, [fieldKey, fieldPropConfig], idx) => {

            if (!!nestedKeys && nestedKeys.includes(fieldKey)) {
                // check if the current key is the nested key

                const nestedComponentArray = getNestedComponentArrayWithProps(
                    Component,
                    fieldPropConfig,
                    fieldKey
                );

                acc.push(...nestedComponentArray)


            } else {
                // spread the component-props onto <Component {...component-props} />
                const currentComponentWithProps = getComponentWithProps(
                    Component,
                    fieldPropConfig,
                    `${fieldKey}_${idx}`
                )
                acc.push(currentComponentWithProps)
            }

            return acc;
        },
        []
    )

    return fieldComponents
}



/**
 * {
 *   key1: propsConfig1, ( should be passed to getComponentWithProps )
 *   key2: propsConfig2, ( should be passed to getComponentWithProps )
 *   key3: {
 *      nestedKey3_1: propsConfig3_1,
 *      nestedKey3_2: propsConfig3_2,
 *   }, ( should be passed to getNestedComponentArrayWithProps )
 * }
 * @param  {} Component
 * @param  {} nestedPropsConfig - { nestedKey3_1:propsConfig3_1, nestedKey3_2:propsConfig3_2, }
 * @param  {} key
 */

function getNestedComponentArrayWithProps(Component, nestedPropsConfigContainer, parentKey = '') {
    // This nestedPropsConfigContainer will contain the object which will contain propsConfig for nested keys
    /**
     * 
     * nestedPropsConfigContainer (aka key3): {
     *    nestedKey3_1: propsConfig3_1,
     *    nestedKey3_2: propsConfig3_2,
     * }
     * 
     */

    const nestedPropsConfigEntries = Object.entries(nestedPropsConfigContainer);

    const nestedFieldComponents = nestedPropsConfigEntries.map(
        ([nestedFieldKey, nestedFieldPropConfig]) => (
            getComponentWithProps(
                Component,
                nestedFieldPropConfig,
                `${nestedFieldKey}_${parentKey}`
            )
        )
    )
    return nestedFieldComponents;

}



/**
 * Assigns the props of propConfig to the Component and returns it
 * @param  {JSX.Element} Component - Component which is to be rendered
 * @param  {{}} propConfig - Object of props to be used for the Component
 * @param  {string} [key] - key property to be used for an array of React.elements
 */

function getComponentWithProps(Component, propConfig = {}, key) {
    propConfig = { ...propConfig, key }
    return (
        <Component {...propConfig} />
    )
}