db.getCollection("sapis").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			    _id:ObjectId("5c24e8ca4c7cde0016387815")
			
			}
		},

		// Stage 2
		{
			$unwind: {
			    path : "$perangkat.data",
			    includeArrayIndex : "arrayIndex", // optional
			    preserveNullAndEmptyArrays : false // optional
			}
		},

		// Stage 3
		{
			$match: {
			    'perangkat.data.tanggal': {
			        $gte: ISODate("2018-12-28T16:12:30.216+0000"),
			        $lte :  ISODate("2018-12-28T16:13:00.176+0000")
			        }
			}
		},

		// Stage 4
		{
			$group: {
			    _id:{_id : '$_id',idPeternak: '$idPeternak',namaSapi: '$namaSapi',status: '$perangkat.status',idOnRaspi:'$perangkat.idOnRaspi'},
			    listResult : {$push: '$perangkat.data'}
			    
			}
		},

		// Stage 5
		{
			$project: {
			    // specifications
			    _id : '$_id._id',
			    idPeternak: '$_id.idPeternak',
			    namaSapi: '$_id.namaSapi',
			    perangkat:{
			    	status : '$_id.status',
			    	data: '$listResult',
			    	idOnRaspi: '$_id.idOnRaspi'
			    	
			    }
			    
			    
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
