import { Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import { Fragment } from "react/jsx-runtime";

function ActivityList() {
  const { activityStore } = useStore();
  const { groupActivities } = activityStore;

  return (
    groupActivities.map(([group, activities]) => {
      return (
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
          {activities.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </Fragment>
      )
    })
  );
}

export default observer(ActivityList);
