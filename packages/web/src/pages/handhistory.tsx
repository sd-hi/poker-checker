import React, { useState, useEffect } from "react";
import {
  RoundHistoryGetResponsePayload,
  RoundResult,
} from "@poker-checker/server";
import NavigationBar from "../components/shared/navigationbar";
import { getRoundResultHistory } from "../api/roundresult";

const HandHistory = () => {
  // Page to display the previously submitted rounds
  const [roundresults, setRoundResults] = useState<Array<RoundResult>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchHistory = async () => {
      // Fetch the round history
      setLoading(true);
      const response: RoundHistoryGetResponsePayload | undefined =
        await getRoundResultHistory(currentPage);

      // Something went wrong
      // TODO - Handle error
      setLoading(false);

      if (response) {

      } else {
        
      }
    };
  }, [currentPage]);

  return (
    <main>
      <NavigationBar />
      <main className="main-container">
        { loading ? <p>Loading</p> : <p>Loaded</p>}
      </main>
    </main>
  );
};

export default HandHistory;
