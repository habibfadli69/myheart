db.getCollection("users").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			    "role" : 2
			
			}
		},

		// Stage 2
		{
			$lookup: // Equality Match
			{
			    from: "peternaks",
			    localField: "_id",
			    foreignField: "idUser",
			    as: "peternak_docs"
			}
			
			// Uncorrelated Subqueries
			// (supported as of MongoDB 3.6)
			// {
			//    from: "<collection to join>",
			//    let: { <var_1>: <expression>, …, <var_n>: <expression> },
			//    pipeline: [ <pipeline to execute on the collection to join> ],
			//    as: "<output array field>"
			// }
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
