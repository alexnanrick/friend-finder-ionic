export class Geometry {
  private latitude: string;
  private longitude: string;
  private type: string;
  
  constructor(latitude: string, longitude: string, type: string) {
    this.setLatitude(latitude);
    this.setLongitude(longitude);
    this.setType(type);
  }
  
  getLatitude(): string {
    return this.latitude;
  }

  setLatitude(value: string) {
    this.latitude = value;
  }

  getLongitude(): string {
    return this.longitude;
  }

  setLongitude(value: string) {
    this.longitude = value;
  }
  
  getType(): string {
    return this.type;
  }
  
  setType(value: string) {
    this.type = value;
  }
}