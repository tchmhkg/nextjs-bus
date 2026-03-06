export const BOUND_TO_DIRECTION: Record<"O" | "I", string> = {
  O: "outbound",
  I: "inbound",
};

export const DIRECTION_TO_BOUND: Record<string, "O" | "I"> = {
  outbound: "O",
  inbound: "I",
};

export const DEFAULT_SERVICE_TYPE = "1";

export function boundToDirection(bound: "O" | "I"): string {
  return BOUND_TO_DIRECTION[bound];
}

export function directionToBound(direction: string): "O" | "I" {
  return DIRECTION_TO_BOUND[direction] ?? "O";
}
