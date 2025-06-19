import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MatchService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "players" } },
          { field: { Name: "zone" } },
          { field: { Name: "time_elapsed" } },
          { field: { Name: "state" } },
          { field: { Name: "max_players" } },
          { field: { Name: "map_size" } },
          { field: { Name: "game_mode" } },
          { field: { Name: "winner_id" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('match', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to fetch matches");
      return [];
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "players" } },
          { field: { Name: "zone" } },
          { field: { Name: "time_elapsed" } },
          { field: { Name: "state" } },
          { field: { Name: "max_players" } },
          { field: { Name: "map_size" } },
          { field: { Name: "game_mode" } },
          { field: { Name: "winner_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById('match', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching match with ID ${id}:`, error);
      toast.error("Failed to fetch match");
      return null;
    }
  }

  async create(matchData) {
    await delay(300);
    try {
      // Only include updateable fields
      const updateableData = {
        Name: matchData.Name || `Match ${Date.now()}`,
        Tags: matchData.Tags,
        Owner: matchData.Owner,
        players: typeof matchData.players === 'string' ? matchData.players : JSON.stringify(matchData.players || []),
        zone: typeof matchData.zone === 'string' ? matchData.zone : JSON.stringify(matchData.zone || {}),
        time_elapsed: matchData.time_elapsed || matchData.timeElapsed || 0,
        state: matchData.state || 'lobby',
        max_players: matchData.max_players || matchData.maxPlayers || 5,
        map_size: typeof matchData.map_size === 'string' ? matchData.map_size : JSON.stringify(matchData.map_size || { width: 800, height: 600 }),
        game_mode: matchData.game_mode || matchData.gameMode || 'Battle Royale',
        winner_id: matchData.winner_id || matchData.winnerId
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('match', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} matches:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating match:", error);
      toast.error("Failed to create match");
      return null;
    }
  }

  async update(id, data) {
    await delay(200);
    try {
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: data.Name,
        Tags: data.Tags,
        Owner: data.Owner,
        players: typeof data.players === 'string' ? data.players : JSON.stringify(data.players),
        zone: typeof data.zone === 'string' ? data.zone : JSON.stringify(data.zone),
        time_elapsed: data.time_elapsed || data.timeElapsed,
        state: data.state,
        max_players: data.max_players || data.maxPlayers,
        map_size: typeof data.map_size === 'string' ? data.map_size : JSON.stringify(data.map_size),
        game_mode: data.game_mode || data.gameMode,
        winner_id: data.winner_id || data.winnerId
      };

      // Remove undefined fields
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === undefined) {
          delete updateableData[key];
        }
      });

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord('match', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} matches:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("Failed to update match");
      return null;
    }
  }

  async delete(id) {
    await delay(200);
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('match', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} matches:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.error("Failed to delete match");
      return null;
    }
  }

  async getActiveMatches() {
    await delay(250);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "players" } },
          { field: { Name: "zone" } },
          { field: { Name: "time_elapsed" } },
          { field: { Name: "state" } },
          { field: { Name: "max_players" } },
          { field: { Name: "map_size" } },
          { field: { Name: "game_mode" } },
          { field: { Name: "winner_id" } }
        ],
        where: [
          {
            FieldName: "state",
            Operator: "EqualTo",
            Values: ["active"]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('match', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching active matches:", error);
      toast.error("Failed to fetch active matches");
      return [];
    }
  }

  async getMatchHistory() {
    await delay(250);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "players" } },
          { field: { Name: "zone" } },
          { field: { Name: "time_elapsed" } },
          { field: { Name: "state" } },
          { field: { Name: "max_players" } },
          { field: { Name: "map_size" } },
          { field: { Name: "game_mode" } },
          { field: { Name: "winner_id" } }
        ],
        where: [
          {
            FieldName: "state",
            Operator: "EqualTo",
            Values: ["ended"]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('match', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching match history:", error);
      toast.error("Failed to fetch match history");
      return [];
    }
  }
}

export default new MatchService();