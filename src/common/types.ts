export interface Location {
  city?: string;
  region?: string;
  country?: string;
  loc?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface Device {
  os: {
    name: string;
    version?: string;
  };
  browser: {
    name: string;
    major: string;
  };
  device: {
    type?: string;
    model?: string;
  };
}
