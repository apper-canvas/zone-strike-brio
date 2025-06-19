import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlayerService {
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
          { field: { Name: "position" } },
          { field: { Name: "health" } },
          { field: { Name: "armor" } },
          { field: { Name: "weapon" } },
          { field: { Name: "ammo" } },
          { field: { Name: "kills" } },
          { field: { Name: "is_alive" } },
          { field: { Name: "is_player" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('player', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to fetch players");
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
          { field: { Name: "position" } },
          { field: { Name: "health" } },
          { field: { Name: "armor" } },
          { field: { Name: "weapon" } },
          { field: { Name: "ammo" } },
          { field: { Name: "kills" } },
          { field: { Name: "is_alive" } },
          { field: { Name: "is_player" } }
        ]
      };

      const response = await this.apperClient.getRecordById('player', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching player with ID ${id}:`, error);
      toast.error("Failed to fetch player");
      return null;
    }
  }

  async create(playerData) {
    await delay(300);
    try {
      // Only include updateable fields
      const updateableData = {
        Name: playerData.Name || playerData.name,
        Tags: playerData.Tags,
        Owner: playerData.Owner,
        position: playerData.position,
        health: playerData.health || 100,
        armor: playerData.armor || 0,
        weapon: playerData.weapon,
        ammo: playerData.ammo || 0,
        kills: playerData.kills || 0,
        is_alive: playerData.is_alive !== undefined ? playerData.is_alive : true,
        is_player: playerData.is_player !== undefined ? playerData.is_player : false
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('player', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} players:${JSON.stringify(failedRecords)}`);
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
      console.error("Error creating player:", error);
      toast.error("Failed to create player");
      return null;
    }
  }

  async update(id, data) {
    await delay(200);
    try {
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: data.Name || data.name,
        Tags: data.Tags,
        Owner: data.Owner,
        position: data.position,
        health: data.health,
        armor: data.armor,
        weapon: data.weapon,
        ammo: data.ammo,
        kills: data.kills,
        is_alive: data.is_alive,
        is_player: data.is_player
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

      const response = await this.apperClient.updateRecord('player', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} players:${JSON.stringify(failedRecords)}`);
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
      console.error("Error updating player:", error);
      toast.error("Failed to update player");
      return null;
    }
  }

  async delete(id) {
    await delay(200);
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('player', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} players:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("Failed to delete player");
      return null;
    }
  }

  async respawn(id) {
    await delay(250);
    try {
      const respawnData = {
        health: 100,
        armor: 0,
        is_alive: true,
        position: JSON.stringify({ x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 })
      };

      return await this.update(id, respawnData);
    } catch (error) {
      console.error("Error respawning player:", error);
      toast.error("Failed to respawn player");
      return null;
    }
  }
}

export default new PlayerService();