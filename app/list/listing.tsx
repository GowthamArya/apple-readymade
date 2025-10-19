import React, { useEffect, useState } from 'react';
import { useLoading } from '../context/LoadingContext';

async function getEntityData(entity: any) {
  const data = await fetch(`/api/generic/${entity}`);
  const response = await data.json();
  return response;
}

export const Listing = ({entity}: any) => {
  alert(entity);
  const [entities, setEntities] = useState<any[]>([]);
  const pageLoading = useLoading();

  useEffect(() => {
    pageLoading.setLoading(true);
    async function fetchData() {
      try {
        const response = await getEntityData(entity);
        setEntities(response);
        pageLoading.setLoading(false);
      } catch (err) {
        console.error('Failed to fetch entity data:', err);
        pageLoading.setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2>Listing</h2>
      <pre>{JSON.stringify(entities, null, 2)}</pre>
    </div>
  );
};

