import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  get groupActivities() {
    // This is like groupBy in c#
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as {[key: string] : Activity[]})
    );
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        this.setActivity(activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoadingInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => (this.selectedActivity = activity));
        return activity;
      } catch (error) {
        console.log(error);
      } finally {
        this.setLoadingInitial(false);
      }
    }
  };

  private setActivity = (activity: Activity) => {
    activity.date = activity.date.split("T")[0];
    this.activityRegistry.set(activity.id, activity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  setLoading = (state: boolean) => {
    this.loading = state;
  };

  setEditMode = (state: boolean) => {
    this.editMode = state;
  };

  createActivity = async (activity: Activity) => {
    this.setLoading(true);
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      this.activityRegistry.set(activity.id, activity);
      this.selectedActivity = activity;
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoading(false);
      this.setEditMode(false);
    }
  };

  updateActivity = async (activity: Activity) => {
    this.setLoading(true);
    try {
      await agent.Activities.update(activity);
      this.activityRegistry.set(activity.id, activity);
      this.selectedActivity = activity;
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoading(false);
      this.setEditMode(false);
    }
  };

  deleteActivity = async (id: string) => {
    this.setLoading(true);
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoading(false);
    }
  };
}
