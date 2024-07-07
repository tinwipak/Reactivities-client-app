import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySeleteInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";

function ActivityForm() {
  const { activityStore } = useStore();
  const {
    loading,
    loadActivity,
    loadingInitial,
    createActivity, updateActivity
  } = activityStore;

  const navigate = useNavigate();

  const { id } = useParams();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: null,
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    category: Yup.string().required(),
    date: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity!))
  }, [id, loadActivity])

  function handleFormSubmit(activity: Activity) {
    if (!activity.id) {
      activity.id = uuid()
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    } else {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={activity}
        onSubmit={values => handleFormSubmit(values)}>
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="title" />
            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySeleteInput options={categoryOptions} placeholder="Category" name="category" />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />

            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />

            <Button
              positive
              loading={loading}
              disabled={isSubmitting || !dirty || !isValid}
              floated="right"
              type="submit"
              content="Submit" />
            <Button as={Link} to='/activities' floated="right" positive type="button" content="Cancel" />
          </Form>
        )}
      </Formik>

    </Segment>
  );
}


export default observer(ActivityForm)