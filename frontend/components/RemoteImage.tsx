import React, { useEffect, useState } from 'react';
import { Image, ActivityIndicator, ImageStyle, StyleProp } from 'react-native';
import axios from '@/services/api';

interface Props {
  fileName: string;
  style?: StyleProp<ImageStyle>;
}

export const RemoteImage = ({ fileName, style }: Props) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName) return;
    
    const fetchUrl = async () => {
      try {
        const response = await axios.get(`/api/v1/files/url?fileName=${fileName}`);
        setUrl(response.data);
      } catch (error) {
        console.error("Error fetching file URL", error);
      }
    };
    fetchUrl();
  }, [fileName]);

  if (!url) return <ActivityIndicator />;
  
  return <Image source={{ uri: url }} style={style} />;
};
