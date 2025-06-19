import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WeaponService {
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
          { field: { Name: "type" } },
          { field: { Name: "damage" } },
          { field: { Name: "fire_rate" } },
          { field: { Name: "range" } },
          { field: { Name: "ammo_capacity" } },
          { field: { Name: "reload_time" } },
          { field: { Name: "accuracy" } },
          { field: { Name: "icon" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('weapon', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching weapons:", error);
      toast.error("Failed to fetch weapons");
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
          { field: { Name: "type" } },
          { field: { Name: "damage" } },
          { field: { Name: "fire_rate" } },
          { field: { Name: "range" } },
          { field: { Name: "ammo_capacity" } },
          { field: { Name: "reload_time" } },
          { field: { Name: "accuracy" } },
          { field: { Name: "icon" } }
        ]
      };

      const response = await this.apperClient.getRecordById('weapon', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching weapon with ID ${id}:`, error);
      toast.error("Failed to fetch weapon");
      return null;
    }
  }

  async getByType(type) {
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
          { field: { Name: "type" } },
          { field: { Name: "damage" } },
          { field: { Name: "fire_rate" } },
          { field: { Name: "range" } },
          { field: { Name: "ammo_capacity" } },
          { field: { Name: "reload_time" } },
          { field: { Name: "accuracy" } },
          { field: { Name: "icon" } }
        ],
        where: [
          {
            FieldName: "type",
            Operator: "EqualTo",
            Values: [type]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('weapon', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching weapons by type:", error);
      toast.error("Failed to fetch weapons by type");
      return [];
    }
  }

  async create(weaponData) {
    await delay(300);
    try {
      // Only include updateable fields
      const updateableData = {
        Name: weaponData.Name || weaponData.name,
        Tags: weaponData.Tags,
        Owner: weaponData.Owner,
        type: weaponData.type,
        damage: weaponData.damage,
        fire_rate: weaponData.fire_rate || weaponData.fireRate,
        range: weaponData.range,
        ammo_capacity: weaponData.ammo_capacity || weaponData.ammoCapacity,
        reload_time: weaponData.reload_time || weaponData.reloadTime,
        accuracy: weaponData.accuracy,
        icon: weaponData.icon
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord('weapon', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} weapons:${JSON.stringify(failedRecords)}`);
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
      console.error("Error creating weapon:", error);
      toast.error("Failed to create weapon");
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
        type: data.type,
        damage: data.damage,
        fire_rate: data.fire_rate || data.fireRate,
        range: data.range,
        ammo_capacity: data.ammo_capacity || data.ammoCapacity,
        reload_time: data.reload_time || data.reloadTime,
        accuracy: data.accuracy,
        icon: data.icon
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

      const response = await this.apperClient.updateRecord('weapon', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} weapons:${JSON.stringify(failedRecords)}`);
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
      console.error("Error updating weapon:", error);
      toast.error("Failed to update weapon");
      return null;
    }
  }

  async delete(id) {
    await delay(200);
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord('weapon', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} weapons:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting weapon:", error);
      toast.error("Failed to delete weapon");
      return null;
    }
  }
}

export default new WeaponService();