import { useState, useEffect } from "react";
import axios from "axios";

const useRank = () => {
  const [rank, setRank] = useState<number>(0);

  useEffect(() => {
    axios
      .get("/api/users/rank")
      .then((res: any) => {
        setRank(res.data.rank);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return { rank };
};

export default useRank;
