import { useState, useMemo, useEffect } from "react";
import { interpret } from "xstate/lib/interpreter";

const useMachine = (machine, options = {}) => {
  const [current, setCurrent] = useState(machine.initialState);

  // useMemo will only recompute the memoized value when one of the inputs has changed
  // In this case service only runs when there is a service.send('SOME_EVENT') call
  const service = useMemo(() => {
    return interpret(machine)
      .onTransition(state => {
        options.log && console.log("CONTEXT:", state.context);
        setCurrent(state);
      })
      .onEvent(e => options.log && console.log("EVENT", e))
      .start();
  }, []);

  // Conditionally firing an effect
  // Passing [] make effect only run on mount and clean up on unmount
  // In this case service only stop on unmount (cWU)
  useEffect(() => {
    return () => service.stop();
  }, []);

  return [current, service.send];
};

export default useMachine;
