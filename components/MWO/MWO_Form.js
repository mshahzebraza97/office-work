// Dependency & Helpers
import React from 'react'
// import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { isObjEmpty, cloneAndPluck } from '../../helpers/reusable'

// Store & Styles
import { addMWOHandler, updateMWOHandler } from '../../lib/apollo_client/mwoApollo'

// Components
import Portal from '../UI/Portal'
import Modal from '../UI/Modal'
import FormikControl from '../Formik/FormikControl'
import FormikForm from '../Formik/FormikForm'
import FormikSubmit from '../Formik/FormikSubmit'



export default function MWO_Form({ closer: modalCloser, activeMWOdata: oldMWOdata = {} }) {

  const isNewSubmission = isObjEmpty(oldMWOdata);

  const oldMWOdataFiltered = cloneAndPluck(
    oldMWOdata,
    ['application', 'itemId', 'itemName', 'qty', 'status', 'title', 'remarks'])

  console.log('MWO_Form -> oldMWOdata', oldMWOdataFiltered)


  const initialValues = {
    mwoId: '',
    application: '',
    itemId: '',
    itemName: '',
    qty: '',
    status: '',
    title: '',
    remarks: '',
    ...oldMWOdataFiltered
  }

  const validationSchema = Yup.object().shape({
    mwoId: Yup.string().required('Required'),
    application: Yup.string().required('Required'),
    itemId: Yup.string().required('Required'),
    itemName: Yup.string().required('Required'),
    qty: Yup.string().required('Required'),
    status: Yup.string().required('Required'),
    title: Yup.string().required('Required'),
    remarks: Yup.string(),
  })

  function onSubmit(values, { resetForm }) {
    isNewSubmission
      ? addMWOHandler(values)
      : updateMWOHandler(values);
    resetForm()
    modalCloser();
  }
  let statusOptions = [
    { key: 'Select One ...', value: '' },
    { key: 'Not Started', value: 'Not Started' },
    { key: 'Active', value: 'Active' },
    { key: 'Delivered', value: 'Delivered' },
  ]
  !isNewSubmission && statusOptions.push(
    { key: 'Closed', value: 'Closed' },
  )

  return (
    <Portal>

      <Modal title={`${isNewSubmission ? 'New' : 'Update'} MWO`} closer={modalCloser}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {
            ({ values, isValid, dirty, isSubmitting }) => {
              // TODO: values can be used to mutate one field w.r.t the other.
              return (
                <FormikForm>
                  {/* 'title' */}
                  <FormikControl
                    control='input'
                    type='text'
                    name='title'
                    label='Title / Description'
                  />
                  {/* 'mwoId' */}
                  <FormikControl
                    control='input'
                    type='text'
                    name='mwoId'
                    label='MWO ID'
                    disabled={!isNewSubmission}
                  />
                  {/* 'application' */}
                  <FormikControl
                    control='select'
                    name='application'
                    label='Application / Use'
                    options={[
                      { key: 'Select One ...', value: '' },
                      { key: 'Make it dynamic 3K', value: 'PEMA-L3K-BD' },
                      { key: 'Lab Use', value: 'LU' },
                      { key: 'R&D', value: 'R&D' },
                      { key: 'Miscellaneous', value: 'MISC' },
                    ]}
                  />
                  {/* 'itemId' */}
                  <FormikControl
                    control='input'
                    type='text'
                    name='itemId'
                    label='Item ID'
                    placeholder='LU-20211212 OR R&D-20211212 OR PEMA-L3K-BD-0200-01'
                  />
                  {/* 'itemName' */}
                  <FormikControl
                    control='input'
                    type='text'
                    placeholder='Should be dependant on the Item Id field'
                    name='itemName'
                    label='Item Name'
                  />
                  {/* 'qty' */}
                  <FormikControl
                    control='input'
                    type='number'
                    name='qty'
                    label='Order Quantity'
                  />
                  {/* 'status' */}
                  <FormikControl
                    control='select'
                    name='status'
                    label='Status'
                    options={statusOptions}
                  />
                  {/* 'remarks' */}
                  <FormikControl
                    control='textarea'
                    // type='text'
                    name='remarks'
                    label='Remarks'
                  />

                  <FormikSubmit disabled={(!isValid || !dirty || isSubmitting)} >
                    {/* all 3 must be false to disable */}

                    {
                      isValid ?
                        dirty
                          ? `Submit ${isNewSubmission ? '(Add)' : '(Update)'}`
                          : 'No edits made'
                        : 'Incomplete/Invalid Data'
                    }
                  </FormikSubmit>

                </FormikForm>
              )
            }
          }
        </Formik>
      </Modal>
    </Portal>
  )
}
