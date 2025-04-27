import { LiveProvider } from "@refinedev/core";

import Parse from "parse";

export const liveProvider: LiveProvider = {
  subscribe: async ({ params, callback }: any) => {
    const { resource, filters } = params;

    const query = new Parse.Query(resource);
    query.equalTo("project", "pending"); //NOTE: only live update for live bot
    if (filters) {
      filters.forEach((filter: any) => {
        if (filter.operator === "eq") {
          query.equalTo(filter.field, filter.value);
        }
      });
    }

    try {
      const subscription = await query.subscribe();

      subscription.on("create", (object) => {
        callback({
          action: "create",
          resource,
          params,
          data: {
            id: object.id,
            ...object.toJSON(),
            _parseObject: object,
          },
        });
      });

      subscription.on("update", (object) => {
        callback({
          action: "update",
          resource,
          params,
          data: {
            id: object.id,
            ...object.toJSON(),
            _parseObject: object,
          },
        });
      });

      subscription.on("delete", (object) => {
        callback({
          action: "delete",
          resource,
          params,
          data: {
            id: object.id,
            ...object.toJSON(),
            _parseObject: object,
          },
        });
      });

      return subscription;
    } catch (error) {
      console.error(`Error subscribing to ${resource}:`, error);
      throw error;
    }
  },

  unsubscribe: async (subscriptionPromise) => {
    const subscription = await subscriptionPromise;
    if (subscription) {
      subscription.unsubscribe();
    }
  },
};
