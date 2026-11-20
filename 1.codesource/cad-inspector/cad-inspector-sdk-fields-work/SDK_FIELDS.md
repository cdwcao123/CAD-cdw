# SDK field extraction preview

left_side and right_side are derived from the nearest boundary projections in drawing units. laneway_width is their mean sum across the candidate's points. These are geometric estimates, not surveyed width measurements. Missing or ambiguous sides remain null.

The exported array contains the SDK/interface fields; unavailable fields and temporary candidate lane codes are null. Boundary-derived distances and widths use drawing units and are not automatically converted to meters.

Mine information, footage, radius, coal thickness, secondary side values and other unknown fields are not invented. The push entry does not perform field completeness validation. The receiving system may reject null values; SDK import and cloud write have not been verified end to end. All candidates require professional review.
