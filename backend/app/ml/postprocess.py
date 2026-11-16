def severity_from_area(area_ratio: float) -> str:
    """Heuristic: bigger share of the frame = more severe.
    Depends on camera distance, so treat it as a rough first version."""
    if area_ratio < 0.02:
        return "low"
    if area_ratio < 0.08:
        return "medium"
    return "high"