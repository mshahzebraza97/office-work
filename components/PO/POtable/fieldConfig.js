import Button from '@mui/material/Button'


const statusLookup = {
    0: 'Rejected',
    1: 'Draft',
    2: 'Initiated',
    3: 'ERP Approved',
    4: 'Supplier Evaluated',
    5: 'Concurrence Approved',
    6: 'PO Approved',
    7: 'LC Opened',
    8: 'Delivery Confirmed',
    9: 'Closed',
}

function formatModules(modules) {
    if (!modules || modules.length === 0) return null;
    // return modules.map(module => module.name).join(', ');
    return modules.join(', ');
}



export const columns = [
    {
        field: 'id',
        title: 'Sr.',
        // ?this field now is not editable in the table... must be added dynamically
        editable: false,
        // flex: 1,
    },
    {
        field: 'refType',
        title: 'Source',
        description: 'Source of Data',
        // flex: 1,
    },
    {
        field: 'refId',
        title: 'Source ID',
        description: 'ID of Data Source',
        // flex: 1,
    },
    {
        field: 'ID',
        title: 'Reference',
        description: 'Type & ID of Data Source',
        // ? Value Getters || Dependent Fields
        valueGetter: (params) => (`${params.row.refType || ''}# ${params.row.refId || ''}`),
        // flex: 1,
    },
    {
        field: 'linkedModules', // inv.total
        title: 'Items',
        description: 'What type of items were procured',
        sortable: false,
        //? Custom Components | Formatters
        render: (rowData) => formatModules(rowData.linkedModules),
        // flex: 1,
        //? to assign a custom component to a column, you can use the following syntax: 
        // editComponent: props => (
        //     <input
        //       type="text"
        //       value={props.value}
        //       onChange={e => props.onChange(e.target.value)}
        //     />
        //   )

    },
    {
        field: 'status',
        title: 'Status',
        description: 'Current Status of PO',
        lookup: statusLookup, // ? Lookups
        // flex: 1,
    },

];
