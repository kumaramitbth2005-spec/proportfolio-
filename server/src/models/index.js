import mongoose from 'mongoose';
const {Schema,model,models}=mongoose;
const schema=(definition,options={})=>new Schema(definition,{timestamps:true,strict:true,...options});
const webUrl=value=>{if(!value)return true;try{return ['http:','https:'].includes(new URL(value).protocol)}catch{return false}};
const profileEmail=value=>!value||/^\S+@\S+\.\S+$/.test(value);
export const Admin=models.Admin||model('Admin',schema({name:{type:String,required:true},email:{type:String,required:true,unique:true,lowercase:true},passwordHash:{type:String,required:true},role:{type:String,default:'admin'}}));
export const Profile=models.Profile||model('Profile',schema({name:String,role:String,tagline:String,about:String,location:String,contactEmail:{type:String,validate:{validator:profileEmail,message:'Enter a valid contact email.'}},phoneNumber:String,whatsappNumber:String,availabilityStatus:String,resumeUrl:{type:String,validate:{validator:webUrl,message:'Resume URL must use HTTP or HTTPS.'}},stats:[Schema.Types.Mixed]}));
export const Education=models.Education||model('Education',schema({institution:{type:String,required:true},degree:String,field:String,startYear:String,endYear:String,percentage:String,description:String,location:String,order:{type:Number,default:0}}));
export const Skill=models.Skill||model('Skill',schema({name:{type:String,required:true},category:{type:String,default:'Skills'},proficiency:Number,order:{type:Number,default:0}}));
export const Project=models.Project||model('Project',schema({title:{type:String,required:true},slug:{type:String,index:true},description:String,problem:String,solution:String,features:[String],technologies:[String],category:String,githubUrl:{type:String,validate:{validator:webUrl,message:'GitHub URL must use HTTP or HTTPS.'}},liveUrl:{type:String,validate:{validator:webUrl,message:'Live URL must use HTTP or HTTPS.'}},imageUrl:{type:String,validate:{validator:webUrl,message:'Image URL must use HTTP or HTTPS.'}},featured:{type:Boolean,default:false},status:String,order:{type:Number,default:0},architecture:String,challenges:String,futureImprovements:String,screenshots:[String]}));
export const Certificate=models.Certificate||model('Certificate',schema({title:{type:String,required:true},issuer:String,issueDate:String,credentialId:String,fileUrl:{type:String,validate:{validator:webUrl,message:'Certificate URL must use HTTP or HTTPS.'}},verificationUrl:{type:String,validate:{validator:webUrl,message:'Verification URL must use HTTP or HTTPS.'}},category:String}));
export const Social=models.Social||model('Social',schema({platform:{type:String,required:true},url:{type:String,required:true,validate:{validator:value=>webUrl(value)||value?.startsWith('mailto:'),message:'Social link must be an HTTP, HTTPS, or mailto URL.'}}}));
export const Resume=models.Resume||model('Resume',schema({resumeUrl:{type:String,validate:{validator:webUrl,message:'Resume URL must use HTTP or HTTPS.'}},summary:String}));
export const ContactMessage=models.ContactMessage||model('ContactMessage',schema({name:{type:String,required:true,maxlength:100},email:{type:String,required:true,lowercase:true,maxlength:254},subject:{type:String,maxlength:160},message:{type:String,required:true,maxlength:4000},status:{type:String,enum:['new','read','replied','archived'],default:'new'}}));
const chatSessionSchema = schema({
  visitorToken: { type: String, required: true, index: true },
  visitorId: { type: String, index: true },
  visitorName: { type: String, required: true, maxlength: 100 },
  visitorEmail: { type: String, required: true, lowercase: true, maxlength: 254 },
  status: { type: String, enum: ['active', 'closed', 'open'], default: 'active', index: true },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now, index: true },
  lastActiveAt: { type: Date, default: Date.now },
  unreadForOwner: { type: Number, default: 0 },
  unreadForVisitor: { type: Number, default: 0 }
});
chatSessionSchema.index({ visitorToken: 1, visitorEmail: 1 });
chatSessionSchema.index({ updatedAt: -1 });

const chatMessageSchema = schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
  sender: { type: String, enum: ['visitor', 'owner'], required: true },
  senderType: { type: String, enum: ['visitor', 'owner'], default: function() { return this.sender; } },
  message: { type: String, required: true, maxlength: 4000 },
  messageType: { type: String, default: 'text' },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  deliveredAt: { type: Date, default: Date.now },
  clientTempId: { type: String },
  emailMessageId: { type: String, index: true },
  inReplyTo: { type: String },
  references: [String]
});
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const ChatSession = models.ChatSession || model('ChatSession', chatSessionSchema);
export const ChatMessage = models.ChatMessage || model('ChatMessage', chatMessageSchema);
