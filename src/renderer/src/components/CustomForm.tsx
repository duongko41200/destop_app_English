import { SaveButton, SimpleForm, ValidateForm } from 'react-admin';
import { SubmitHandler, FieldValues } from 'react-hook-form';
// import DeleteButtonFlexEnd from './DeleteButtonFlexEnd';
import { Link } from 'react-router-dom';
import { Stack, Button } from '@mui/material';
import { RecordValue } from '@/types/general';

/**
 * Create CustomForm component with delete, save and cancel buttons
 * @param children: JSX.Element[] - children components
 * @param handleSave: SubmitHandler<FieldValues> - function to handle save action
 * @param pathTo: string - path to redirect after cancel button is clicked
 * @param showDeleteButton: boolean - show delete button
 * @param showSaveButton: boolean - show save button
 * @param showCancelButton: boolean - show cancel button
 * @param validate: (values: FieldValues) => Record<string, any> - validate function
 * @param props: any - other props
 * @returns
 */
const CustomForm = ({
  children,
  handleSave,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  validate,
  ...props
}: {
  children: JSX.Element | JSX.Element[];
  handleSave?: SubmitHandler<FieldValues>;
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?:boolean;
  pathTo: string;
  validate?: ValidateForm;
  props?: RecordValue;
}) => {
  return (
    <SimpleForm
      onSubmit={handleSave}
      warnWhenUnsavedChanges={true}
      toolbar={false}
      validate={validate}
    >
      {/* {showDeleteButton ? <DeleteButtonFlexEnd /> : null} */}

      {children}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        width="100%"
        sx={{
          backgroundColor: '#f1f1f1',
          padding: '1rem',
          borderRadius: '4px',
          marginTop: '1rem',
        }}
        {...props}
      >
        {showSaveButton ? <SaveButton alwaysEnable={alwaysEnable} /> : null}
        {showCancelButton ? (
          <Link to={pathTo}>
            <Button type="button" variant="contained" color="error">
              Cancel
            </Button>
          </Link>
        ) : null}
      </Stack>
    </SimpleForm>
  );
};

export default CustomForm;
