export class Permission
{
     //User
     public static readonly ViewUser = "user.read";

     public static readonly AddUser = "user.create";
     public static readonly UpdateUser = "user.update";
     public static readonly DeleteUser = "user.delete";
     //Role
     public static readonly ViewRole = "user.read";

     public static readonly AddRole = "role.create";
     public static readonly UpdateRole = "role.update";
     public static readonly DeleteRole = "role.delete";

     //Audience
     public static readonly ViewAudience = "audience.read";

     public static readonly AddAudience = "audience.create";
     public static readonly UpdateAudience = "audience.update";
     public static readonly DeleteAudience = "audience.delete";

     public static readonly ViewContactToAudience = "contacttoaudience.read";

     public static readonly AddContactToAudience = "contacttoaudience.create";
     public static readonly UpdateContactToAudience = "contacttoaudience.update";
     public static readonly DeleteContactToAudience = "contacttoaudience.delete";

     //Internal Company
     public static readonly ViewInternalCompany = "internalcompany.read";

     public static readonly AddInternalCompany = "internalcompany.create";
     public static readonly UpdateInternalCompany = "internalcompany.update";
     public static readonly DeleteInternalCompany = "internalcompany.delete";
     //Internal Company contact
     public static readonly ViewInternalCompanyContact = "internalcompanycontact.read";

     public static readonly AddInternalCompanyContact = "internalcompanycontact.create";
     public static readonly UpdateInternalCompanyContact = "internalcompanycontact.update";
     public static readonly DeleteInternalCompanyContact = "internalcompanyCompany.delete";

     //Campaign
     public static readonly ViewCampaign = "campaign.read";

     public static readonly AddCampaign = "campaign.create";
     public static readonly UpdateCampaign = "campaign.update";
     public static readonly DeleteCampaign = "campaign.delete";

     //Contact To Campaign
     public static readonly ViewContactToCampaign = "contacttocampaign.read";

     public static readonly AddContactToCampaign = "contacttocampaign.create";
     public static readonly UpdateContactToCampaign = "contacttocampaign.update";
     public static readonly DeleteContactToCampaign = "contacttocampaign.delete";

     //Campaign Node
     public static readonly ViewCampaignNode = "campaignnode.read";

     public static readonly AddCampaignNode = "campaignnode.create";
     public static readonly UpdateCampaignNode = "campaignnode.update";
     public static readonly DeleteCampaignNode = "campaignnode.delete";
     //audiencetocampaign
     public static readonly ViewAudienceToCampaign = "contacttocampaign.read";

     public static readonly AddAudienceToCampaign = "audiencetocampaign.create";
     public static readonly UpdateAudienceToCampaign = "audiencetocampaign.update";
     public static readonly  DeleteAudienceToCampaign = "audiencetocampaign.delete";
       // search contact
       public static readonly  Searchcontact = "searchcontact.search";
       public static readonly  SeachAudience = "searchaudience.search";
 }
 